using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ChatApplication
{
    public class MessageService: IHostedService
    {
        private List<Message> _messages;
        private ILogger<MessageService> _logger;
        public List<Message> Messages { get { sort();  return _messages; } }

        private void sort()
        {
            _messages = _messages.OrderByDescending(o => o.Sent).ToList();
        }

        public MessageService(ILogger<MessageService> logger)
        {
            _messages = new List<Message>();
            _logger = logger;
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting message service");
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping message service");
            return Task.CompletedTask;
        }

        public void AddMessage(Message message)
        {
            _messages.Add(message);
        }
    }
}
