let tableName="language";

async function AddItem(req,res,next){
    let name        = req.body.name     || "";

    res.ok=false;
    res.err="";
    if(name === ""){
        res.err="wrong parameters";
        return next();
    }
    const Query = `INSERT INTO ${tableName} (name) VALUES (?)`;
    let values = [name];
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;
    res.insertId = rows.insertId;

    next();
}

async function UpdateItem(req,res,next){
    let id              = req.params.id         || -1 ;
    let user_id         = req.user_id           || -1;
    let trufa_id        = req.body.trufa_id     || -1;
    let timing_id       = req.body.timing_id    || -1;
    let qtt             = req.body.qtt          || -1;
    let start_date      = req.body.start_date   || null;
    let end_date        = req.body.end_date     || null;
    let every_x_days    = req.body.every_x_days || 1;
    let days            = req.body.days         || '';

    let Query = `UPDATE ${tableName} SET `;
    Query += `trufa_id     = ?  , `;
    Query += `timing_id    = ?  , `;
    Query += `qtt          = ?  , `;
    Query += `every_x_days = ?  , `;
    Query += `days         = ?  , `;
    Query += `start_date   = ?  , `;
    Query += `end_date     = ?    `;
    Query += ` WHERE id=?` ;
    Query += ` AND user_id=?` ;
    let values = [trufa_id, timing_id, qtt,every_x_days,days, start_date,end_date,id,user_id];

    res.ok=false;
    res.err="";
    if(id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }
    if(user_id<0 || trufa_id<0 || timing_id<0 || qtt<=0){
        res.err="wrong parameters";
        return next();
    }
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;

    next();
}

async function DeleteItem(req,res,next){
    let user_id = req.user_id  || -1;
    let id      = req.body.id  || -1 ;
    let Query = `DELETE FROM ${tableName}  `;
    Query += ` WHERE id=? ` ;
    Query += ` AND user_id=?` ;
    let values = [id,user_id];

    res.ok=false;
    if(id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;

    next();
}

async function GetAllItems(req,res,next){
    let user_id     = req.user_id            || -1;
    let only_active = parseInt(req.query.only_active)  || 1;
    let today = GenObj_Mid.DateToNormalString(new Date());
    const dayOfWeek = new Date(today).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // console.log("only_active=",only_active," req active=",req.query.only_active)
    let values = [];
    let Query = `SELECT tt.* `;
    Query += ", DATE_FORMAT(tt.start_date,'%d-%m-%Y') as nice_start_date";
    Query += ", DATE_FORMAT(tt.end_date,'%d-%m-%Y') as nice_end_date";

    if(only_active === 1) {
        // Add frequency-based logic with join to user_history
        Query += ` FROM ${tableName} tt `;
        Query += ` LEFT JOIN (`; // this is a subquery that returns the latest taken_time pill for each user, timing pair
        Query += `   SELECT user_id, trufa_id, timing_id, MAX(taken_at) as latest_taken`;
        Query += `   FROM user_history`;
        Query += `   WHERE taken_at < ?`;
        values.push(today);
        Query += `   GROUP BY user_id, trufa_id, timing_id`;
        Query += ` ) uh ON tt.user_id = uh.user_id AND tt.trufa_id = uh.trufa_id AND tt.timing_id = uh.timing_id`;
        Query += ` WHERE tt.user_id=?`;
        values.push(user_id);
        Query += ` AND ((tt.start_date <= ?) OR (tt.start_date IS NULL))`;
        Query += ` AND ((? <= tt.end_date) OR (tt.end_date IS NULL))`;
        values.push(today);
        values.push(today);
        Query += ` AND (`;
        Query += ` (tt.every_x_days = 1 ) `;
        Query += ` OR`
        Query += ` (tt.every_x_days > 1 `;
        Query += `      AND (`;
        Query += `           (tt.every_x_days <= COALESCE(DATEDIFF(?, DATE(uh.latest_taken)), -1))`;
        values.push(today);
        Query += `            OR `;
        Query += `             (uh.latest_taken IS NULL)`;
        Query += `      )`;
        Query += ` )`
        Query += ` OR `;
        Query += ` (tt.every_x_days=0 AND tt.days LIKE '%,?,%' )`;
        values.push(dayOfWeek);
        Query += ` )`;
    } else {
        // Simple query without frequency logic
        Query += ` FROM ${tableName} tt `;
        Query += ` WHERE tt.user_id=?`;
        values.push(user_id);
    }
    Query += ` ORDER BY tt.timing_id  `;
    // console.log(Query)
    // console.log(GenObj_Mid.formatSqlQuery(Query,values));
    res.ok=false;
    res.err="";
    let rows= (user_id<0)? [] : await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    let plan_by_timing=[];
    for(let row of rows){
        if(plan_by_timing[row.timing_id] === undefined){
            plan_by_timing[row.timing_id]=[];
        }
        plan_by_timing[row.timing_id].push(row);
    }
    res.ok=true;
    req.ItemsData={list:rows,plan_by_timing:plan_by_timing};

    next();
}


module.exports = {
    AddItem,
    UpdateItem,
    DeleteItem,
    GetAllItems,
}