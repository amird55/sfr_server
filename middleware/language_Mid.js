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
    let id          = req.params.id     || -1 ;
    let name        = req.body.name     || "";

    let Query = `UPDATE ${tableName} SET `;
    Query += `name     = ?   `;
    Query += ` WHERE id=?` ;
    let values = [name,id];

    res.ok=false;
    res.err="";
    if(id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }
    if(name === ""){
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
    let id      = req.body.id  || -1 ;
    let Query = `DELETE FROM ${tableName}  `;
    Query += ` WHERE id=? ` ;
    let values = [id];

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

    let values = [];
    let Query = `SELECT * FROM ${tableName}  `;
    Query += " ORDER BY name  ";
    // console.log(Query)
    // console.log(GenObj_Mid.formatSqlQuery(Query,values));
    res.ok=false;
    res.err="";
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    let data_by_id=[];
    for(let row of rows){
        data_by_id[row.id]=row.name;
    }
    res.ok=true;
    req.ItemsData={list:rows,data_by_id:data_by_id};

    next();
}


module.exports = {
    AddItem,
    UpdateItem,
    DeleteItem,
    GetAllItems,
}