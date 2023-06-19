const dbUser = require('../repository/user');
const dbUnext = require('../repository/unextUser');
const dbHistory = require('../repository/unextSubHisotry');
const neterror = require('../model/neterror');
const crypto = require('crypto');

const { UNIX_TIMESTAMP, UNIX_TIMESTAMP_NOW, isEmpty, btoa, atob } = require('../util/property');

const hashEncode = (password) => {
    const salt = "sh32ye4Nd3o932Djqqdtnm4v";
    return crypto.createHash('sha512').update(password + salt).digest('hex');
}

const generateRandomString = (num) => {
  const characters ='0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const register = async (conn, req) => {
    
    await conn.beginTransaction();
    
    if(isEmpty(req["e-mail"]) | isEmpty(req["birth"]) | isEmpty(req["gender"]) | isEmpty(req["u_id"]))
        throw new neterror(400, "E0009	", "subs pass not found", new Error());
    
    // Step 1. 계정이 있을 경우 (기준 "u-id")
    const [unext_user] = await conn.query(dbUnext.findByunextId, req["u_id"].toString());

    console.log(unext_user);
    
    if (!isEmpty(unext_user)) {
        
        const [history] = await conn.query(dbHistory.insertHistory, [ req["u_id"], unext_user[0]["spo_id"], req["e-mail"], 1 ]);
        const [unext_user2] = await conn.query(dbUnext.updatedSetActiveByunextId, [1, req["u_id"]]);
        
        await conn.commit();
    
        return `{"pass" : null, "isNew" : false, "isActive" : true, "id" : "${req["e-mail"]}"}`;
    }


    // Step 2. 계정 저장

    // 임시 비밀번호 발급
    const pass = generateRandomString(12);
    const hashPass = hashEncode(pass);
    
    // console.log(pass);
    // console.log(hashPass);
    
    // 2-1 계정 저장
    const [new_user] = await conn.query(dbUser.insertUsersWithStatus6, [req["e-mail"], hashPass, UNIX_TIMESTAMP_NOW(), UNIX_TIMESTAMP_NOW()]);

    if(isEmpty(new_user.insertId))
        throw new neterror(400, "E0004", "db insert faild 1", new Error());
    
    // console.log(new_user);
    
    // 2-2 상세 저장
    const [new_user_de] = await conn.query(dbUser.insertUsersDetailWithSignUpPath9, [new_user.insertId, req["e-mail"], req["birth"], req["gender"], UNIX_TIMESTAMP_NOW() ]);

    // console.log(new_user_de);
    
    if(isEmpty(new_user_de))
        throw new neterror(400, "E0004", "db insert faild 2", new Error());
        
    // 2-3 UNEXT new 유저 맵핑
    const [unext_new_user] = await conn.query(dbUnext.insertUserMapping, [ req["u_id"], new_user.insertId]);
    
    if(isEmpty(unext_new_user))
        throw new neterror(400, "E0004", "db insert faild 2", new Error());
    
    // Step 3. 히스토리 기록
    const [history] = await conn.query(dbHistory.insertHistory, [req["u_id"], new_user.insertId, req["e-mail"], 1 ]);
    
    if(isEmpty(history))
        throw new neterror(400, "E0004", "db insert faild 2", new Error());
    
    await conn.commit();
    
    return `{"pass" : "${pass}", "isNew" : true, "isActive" : true, "id" : : "${req["e-mail"]}"}`;
};

const unregister = async (conn, req) => {
    
    await conn.beginTransaction();
    
    if(isEmpty(req["u_id"]))
        throw new neterror(400, "E0009	", "subs pass not found", new Error());
    
    let user_id = null;
    
    // Step 1. 계정이 있을 경우 (기준 "u-id")
    const [unext_user] = await conn.query(dbUnext.findByunextId, req["u_id"].toString());
    
    if (!isEmpty(unext_user)) {
        
        const [history] = await conn.query(dbHistory.insertHistory, [ req["u_id"], unext_user[0]["spo_id"], req["e-mail"], 0 ]);
        const [unext_user2] = await conn.query(dbUnext.updatedSetActiveByunextId, [0, req["u_id"]]);
        
        await conn.commit();
    
        return `{"isActive" : false, "id" : "${req["u_id"]}"}`;
    }

    // Step 2. 히스토리 기록
    const [history] = await conn.query(dbHistory.insertHistory, [req["u_id"], user_id, req["e-mail"], 0 ] );
        
    await conn.commit();
    
    return `{"isActive" : false, "id" : "${req["u_id"]}"}`;
};

module.exports = {
    register,
    unregister
}
