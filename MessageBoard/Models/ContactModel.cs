using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MessageBoard.Models
{
    public class ContactModel
    {
        public string fullname { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string comment { get; set; }
    }
}
