using ChatApplication.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChatApplication.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private MessageService _service;
        private ILogger<ChatController> _logger;
        private IHubContext<MessageHub> _hub;

        public ChatController(ILogger<ChatController> logger, IHostedService service, IHubContext<MessageHub> messageHub)
        {
            _service = service as MessageService;
            _logger = logger;
            _hub = messageHub;
        }

        [HttpGet]
        [Route("get-messages")]
        public ActionResult<List<Message>> GetMessages()
        {
            _logger.LogInformation("ChatController GetMessages");
            return Ok(_service.Messages);
        }

        [HttpPost]
        [Route("add-message")]
        [Consumes("application/json")]
        public ActionResult<List<Message>> AddMessage([FromBody] Message message)
        {
            _logger.LogInformation("ChatController AddMessage");
            message.Sent = DateTime.Now;
            _service.AddMessage(message);
            _hub.Clients.All.SendAsync("message", _service.Messages);
            return Ok(_service.Messages);
        }
    }
}
