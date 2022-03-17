namespace neltic.handler
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.SessionState;

    /// <summary>
    /// Summary description for Data
    /// </summary>
    public class GetData : IHttpHandler, IRequiresSessionState
    {
        public class Data
        {
            [JsonProperty(PropertyName = "id")]
            public int Id { get; set; }

            [JsonProperty(PropertyName = "name")]
            public string Name { get; set; }

            [JsonProperty(PropertyName = "phone")]
            public string Phone { get; set; }
        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var data = new List<Data>();
            var reset = context.Request.Form["reset"] != null && context.Request.Form["reset"].ToString().Equals("true");
            if (HttpContext.Current.Session["data"] == null || reset)
            {
                SetDefaultData();
            }
            if (context.Request.Form["winner"] != null)
            {
                SetWinner.Set(int.Parse(context.Request.Form["winner"]));
            }
            data = (List<Data>)HttpContext.Current.Session["data"];
            context.Response.Write(JsonConvert.SerializeObject(data));
        }

        public void SetDefaultData()
        {
            var data = new List<Data>();
            // creamos datos simulados
            data.Add(new Data() { Id = 100001, Name = "Patricia Martínez", Phone = "52 55 4433 2211" });
            data.Add(new Data() { Id = 100002, Name = "Andrea Aguilar", Phone = "52 55 4433 2212" });
            data.Add(new Data() { Id = 100003, Name = "Mario Jiménez", Phone = "52 55 4433 2213" });
            data.Add(new Data() { Id = 100004, Name = "Miguel Pérez", Phone = "52 55 4433 2214" });
            data.Add(new Data() { Id = 100005, Name = "Paola Gómez", Phone = "52 55 4433 2215" });
            data.Add(new Data() { Id = 100006, Name = "Daniel Cadena", Phone = "52 55 4433 2216" });
            data.Add(new Data() { Id = 100007, Name = "Gabriela Orozco", Phone = "52 55 4433 2217" });
            data.Add(new Data() { Id = 100008, Name = "Regina Mijangos", Phone = "52 55 4433 2218" });
            data.Add(new Data() { Id = 100009, Name = "Fernando Cruz", Phone = "52 55 4433 2219" });
            data.Add(new Data() { Id = 100010, Name = "Fabiola Hernández", Phone = "52 55 4433 2220" });
            data.Add(new Data() { Id = 100011, Name = "Jaime Esponiza", Phone = "52 55 4433 2221" });
            data.Add(new Data() { Id = 100012, Name = "Gerardo García", Phone = "52 55 4433 2222" });
            data.Add(new Data() { Id = 100013, Name = "Alfredo Valdés", Phone = "52 55 4433 2223" });
            data.Add(new Data() { Id = 100014, Name = "Antonio Espindola", Phone = "52 55 4433 2224" });
            data.Add(new Data() { Id = 100015, Name = "Jimena Suárez", Phone = "52 55 4433 2225" });
            data.Add(new Data() { Id = 100016, Name = "Karla Carrillo", Phone = "52 55 4433 2226" });
            data.Add(new Data() { Id = 100017, Name = "Roy Contreras", Phone = "52 55 4433 2227" });
            data.Add(new Data() { Id = 100018, Name = "Diego Gutiérrez", Phone = "52 55 4433 2228" });
            data.Add(new Data() { Id = 100019, Name = "Belem Gregorio", Phone = "52 55 4433 2229" });
            data.Add(new Data() { Id = 100020, Name = "Carlos García", Phone = "52 55 4433 2230" });
            HttpContext.Current.Session["data"] = data;
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