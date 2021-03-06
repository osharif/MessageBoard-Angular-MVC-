﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MessageBoard.Data;
using MessageBoard.Models;
using MessageBoard.Services;

namespace MessageBoard.Controllers
{
    public class HomeController : Controller
    {
        private IMailService _mail;
        private IMessageBoardRepository _repo;

        public HomeController(IMailService mail, IMessageBoardRepository repo)
        {
            _mail = mail;
            _repo = repo;
        }

        public ActionResult Index()
        {
            var topics = _repo.GetTopics()
                .OrderByDescending(t => t.Created)
                .Take(25)
                .ToList();

            return View(topics);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Our contact page";

            return View();
        }

        [HttpPost]
        public ActionResult Contact(ContactModel model)
        {
            var msg = string.Format("Comment From: {1}{0} Phone: {2}{0} Email:  {3}{0} Comment: {4}{0}",
                Environment.NewLine,
                model.fullname,
                model.phone,
                model.email,
                model.comment);

            var svc = new MailService();

            if(svc.SendMail("noreply@example.com", "foo@example.com", "WebSite contact", msg))
            {
                ViewBag.MailSent = true;
            }

            return View();
        }


        [Authorize]
        public ActionResult MyMessages()
        {
            return View();
        }
    }
}