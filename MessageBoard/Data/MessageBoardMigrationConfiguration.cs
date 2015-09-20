using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;

namespace MessageBoard.Data
{
    public class MessageBoardMigrationConfiguration : DbMigrationsConfiguration<MessageBoardContext>
    {
        public MessageBoardMigrationConfiguration()
        {
            this.AutomaticMigrationDataLossAllowed = true;
            this.AutomaticMigrationsEnabled = true;            
        }

        protected override void Seed(MessageBoardContext context)
        {
            base.Seed(context);

#if DEBUG
            if(context.Topics.Count()==0)
            {
                var topic = new Topic()
                {
                    Title = "I Love MVC!",
                    Created = DateTime.Now,
                    Body = "I Love ASP.NET MVC and I used it several times!!",
                    Replies = new List<Reply>()
                    {
                        new Reply()
                        {
                            Body = "I Love it too!",
                            Created = DateTime.Now
                        },
                        new Reply()
                        {
                            Body = "Me too!",
                            Created = DateTime.Now
                        },
                        
                        new Reply()
                        {
                            Body = "Aw!",
                            Created = DateTime.Now
                        },
                    }
                };

                context.Topics.Add(topic);

                var anotherTopic = new Topic()
                {
                    Title="i like Java",
                    Created =  DateTime.Now,
                    Body = "Java is also is popular!"
                };

                context.Topics.Add(anotherTopic);

                try
                {
                    context.SaveChanges();
                }
                catch(Exception ex)
                {
                    var msg = ex.Message;
                }
            }
#endif
        }
    }
}
