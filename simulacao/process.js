const find = require('find-process');
var pidusage = require('pidusage')

var memory_usage = 0;
var cpu_usage = 0;

find('name', 'Ganache.exe')
  .then(function (list) {
    for (let index = 0; index < list.length; index++) {
      pidusage(list[index].pid, function (err, stats) {
        memory_usage = memory_usage + stats.memory;
        cpu_usage = cpu_usage + stats.cpu;
      })
    }
    console.log(memory_usage, cpu_usage);
    console.log(list);
    memory_usage = 0; cpu_usage = 0;
  }, function (err) {
    console.log(err.stack || err);
  })


   // => {
        //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
        //   memory: 357306368,    // bytes
        //   ppid: 312,            // PPID
        //   pid: 727,             // PID
        //   ctime: 867000,        // ms user + system time
        //   elapsed: 6650000,     // ms since the start of the process
        //   timestamp: 864000000  // ms since epoch
        // }
        //cb()