using System;
using System.Data;

namespace MMApi.Application.Queries
{
    public class BaseQuery
    {
        protected readonly IDbConnection _dbConnection;

        public BaseQuery(IDbConnection con)
        {
            _dbConnection = con;
        }
    }
}
