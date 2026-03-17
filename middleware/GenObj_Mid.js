async function QueryExecSimpleReply(Query,values=[]) {
    // console.log("QueryExecSimpleReply::",Query);
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query,values);
        return rows;
    } catch (err) {
        console.log(err);
        return false;
        // return res.status(500).json({message: err});
    }
}
