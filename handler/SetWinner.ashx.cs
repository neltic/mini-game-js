namespace neltic.handler
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.IO;
    using System.Web.SessionState;

    /// <summary>
    /// Summary description for Winner
    /// </summary>
    public class SetWinner : IHttpHandler, IRequiresSessionState
    {
        public class Result
        {
            [JsonProperty(PropertyName = "success")]
            public bool Success { get; set; }

            [JsonProperty(PropertyName = "message")]
            public string Message { get; set; }

            [JsonProperty(PropertyName = "winner")]
            public int Winner { get; set; }
        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var result = Set(int.Parse(context.Request.Form["winner"]));
            if (result.Winner != -1)
            {
                // quitamos de la lista ese ganador
                var data = (List<GetData.Data>)HttpContext.Current.Session["data"];
                // TODO: reglas adicionales de nombres, etc
                data.RemoveAt(result.Winner);
                // guardamos esos cambios
                HttpContext.Current.Session["data"] = data;
            }
            context.Response.Write(JsonConvert.SerializeObject(result));
        }

        public static Result Set(int winner)
        {
            var result = new Result();
            try
            {
                result.Winner = winner;
                result.Success = true;
            }
            catch (Exception ex)
            {
                result.Winner = -1;
                result.Success = false;
                result.Message = ex.Message;
            }
            File.WriteAllText(HttpContext.Current.Server.MapPath("~/static/js/data/winner.json"), JsonConvert.SerializeObject(result));
            return result;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}