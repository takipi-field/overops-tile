/*
  Takipi StatsD integrations.
  More information at http://docs.takipi.com/user-interface-and-settings/statsd
  Instructions: Uncomment the relevant backend to ship metrics from Takipi to it.
*/

{ // Start of configuration
  flushInterval: 60000, // This number should be similar to the Takipi flush interval. Contact Takipi support for help with this configuration: support@takipi.com
  // port: 8125, // port to listen on data. UDP.
  // dumpMessages: true, // log all incoming messages
  // debug: true, // Print to log debug statements 
/*
  // Graphite start
  deleteCounters: true,
  graphite: {
    prefixCounter: "",
    prefixGauge: "",
    globalPrefix: "",
    legacyNamespace: false,
  },
  graphitePort: 2003, // port of Graphite server 
  graphiteHost: "127.0.0.1", //hostname or IP of Graphite server
  backends: [ "./backends/graphite" ] // identify this backend as Graphite
  // Graphite end 
*/

/*
  // Hosted Graphite start
  graphitePort: 2003,
  graphiteHost: "carbon.hostedgraphite.com",
  graphite: {
     legacyNamespace: false,
     globalPrefix: "your-api-key-here"
  }
  // Hosted Graphite end
*/

 /*
  // AWS CloudWatch start
  cloudwatch: 
  {
     accessKeyId: 'YOUR_ACCESS_KEY_ID',  // See here: http://amzn.to/1sT9aw0
     secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', // See here: http://amzn.to/1sT9aw0
     region: 'YOUR_REGION' //Example: EU_WEST_1 or US_EAST_1
  },
  backends: [ "aws-cloudwatch-statsd-backend" ] //identify this as AWS CloudWatch
  // AWS CloudWatch end
*/

/*
  // Librato start
  librato: {
   email:  "myemail@example.com", // the email with which you signed up for Librato
   token:  "<API_TOKEN>", // api key obtained from the Librato account page.
   source: "takipi" // a logical identifier for this set of metrics within Librato, defaults to node name
  },
  backends: ["statsd-librato-backend"] // identify this as a Librato backend
  // Librato end
*/

/*
  // Datadog start
  datadogApiKey: "<API_KEY>", // You can get it from this page: https://app.datadoghq.com/account/settings#api
  backends: ["statsd-datadog-backend"] // identify this as a Datadog backend
  // Datadog end
*/

/*
  // Zabbix start
  zabbixPort: 10051, // Zabbix port
  zabbixHost: "localhost", // Zabbix host
  zabbixSender: "/usr/bin/zabbix_sender", // Zabbix sender
  backends: ["statsd-zabbix-backend"] // Identify this as a Zabbix backend
  // Zabbix end
*/

/*
  // InfluxDB start
  influxdb: {
    host: 'localhost',   // InfluxDB host. (default 127.0.0.1)
    port: 8086,          // InfluxDB port. (default 8086)
    version: 0.9,        // InfluxDB version. (default 0.8)
    database: 'mydb',  // InfluxDB database instance. (required)
    flush: {
      enable: true       // Enable regular flush strategy. (default true)
    },
  },
  backends: ["statsd-influxdb-backend"] // identify this as an InfluxDB backend
  // InfluxDB end
*/

/*
  // OpenTSDB start
  opentsdbHost: 'localhost', //the location of the DB node
  opentsdbPort: 4242, // the port on which the DB is listening
  opentsdbTagPrefix: '_t_', // tag support. See more here - http://bit.ly/1N1oJhB
  backends: ['statsd-opentsdb-backend'] //identify this as OpenTSDB backend
  // OpenTSDB end
*/

/*
  // Anodot start
  anodotApiToken: "<your_api_token>", // The API key 
  anodotApiHost: “<api_host”>, // The API host
  backends: ["statsd-anodot-backend"], // Identify this as an Anodot backend
  // Anodot end
*/

/*
  // Alerting (PagerDuty / Slack / Sentry) start
  backends: ["statsd-alerting-backend"], //identify this as an alerting backend

  alerts: {
    dispatchers: {
//  UNCOMMENT THE DISPATCHER YOU WANT
//       slackDispatcher: { //this defines a an integration into Slack
//         type: "slack",
//         config: {
//           host: "https://hooks.slack.com", 
// token: "<SLACK_TOKEN>", //your Slack API key. See more here - http://bit.ly/1hwuDdF
// username: "statsd-alerts", //the user name which is posting the alert
// channel: "#alerts" //the target Slack channel to which this alert will be posted
//         }
//       },
// 
//       pagerdutyDispatcher: { //this defines a an integration into PagerDuty
//         type: "pagerduty",
//         config: {
//           key: "<PAGERDUTY_SERVICE_KEY>" // PagerDuty API key. See more - http://bit.ly/1UBKu8Q
//         }
//       },
// 
//       sentryDispatcher: { //this defines a an integration into Sentry
//         type: "sentry",
//         config: {
//           dsn: "<SENTRY_DSN>"
//         }
//       },
// 
//       hipchatDispatcher: {
//         type: "hipchat",
//         config: {
//           key: "<HIPCHAT_KEY>", // Hipchat API key from: https://<ACCOUNT>.hipchat.com/account/api
//           room: "takipi", // Room to send alerts to
//           color: "red"
//         }
//       }
    },
    events: [{
      name: "*", //any metric fired matching this pattern will be sent out as an alert
      dispatcher: "pagerdutyDispatcher" //the service to which it will be reported
    }],

    metrics: [{
      name: "*", //name of the metric
      type: "counters",
      gte: 1, //operator: gte, gt, lte, lt, eq, delta, delta_gte, delta_gt, delta_lte, delta_lt, delta_eq //delta is the difference between the current sample and the previous one
      dispatcher: "pagerdutyDispatcher" //the service (e.g,PagerDuty) to which this alert is sent.
    }]
  }
*/
  // Alerting (PagerDuty / Slack / Sentry) start



/*
  // New Relic start
  newRelicLicense: '<API_KEY>',
  newRelicApp: 'Takipi',
  globalMetricPrefix: 'Takipi',
  backends: ['statsd-newrelic-backend'],
  
  // New Relic end
*/

/*
  // App Dynamics start
  appdynamics: { 
    base_url: 'http://localhost:8081/machineagent/metrics', // the URL to the Machine Agent listener
    hide_statsd: false // enable to suppress out the statsd.bad_lines_seen and statsd.packets_received metrics
  },
  backends: ["statsd-appdynamics-backend"]
  // App Dynamics end
*/

} // End of configuration
