const cv = {
  "longCV": false,
  "month_names": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "headline": {
    "name": "Mariano Gappa",
    "short": "Senior Software Engineer",
    "experience_start": "2010-03-01",
    "languages": [
      {"id": 1, "name": "English", "image":"images/gb.svg", "level": "(fluent)", "color": "white"},
      {"id": 2, "name": "Spanish", "image":"images/es.svg", "level": "(native)", "color": "white"},
      {"id": 3, "name": "Japanese", "image":"images/jp.svg", "level": "(JLPT N4)", "color": "white"}
    ],
    "links": [
      {
        "link": "mariano.gappa@gmail.com",
        "type": "Email"
      },
      {
        "link": "https://github.com/MarianoGappa",
        "type": "Github"
      },
      {
        "link": "http://marianogappa.github.io/",
        "type": "Blog"
      },
      {
        "link": "https://twitter.com/MarianoGappa",
        "type": "Twitter"
      }
    ],
    "current_location": {"text": "Auckland, New Zealand", "image": "images/nz.svg", "color": "white"},
    "born_location": {"text": "Buenos Aires, Argentina", "image": "images/ar.svg", "color": "white"},
    "expertise_bullets": [
      {"id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg"},
      {"id": 2, "text": "Scala", "color": "red", "image": "images/scala.svg"},
      {"id": 3, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
      {"id": 4, "text": "MySQL", "color": "blue", "image": "images/mariadb.svg"},
      {"id": 5, "text": "Kubernetes", "color": "blue", "image": "images/kubernetes.svg"},
      {"id": 6, "text": "AWS", "color": "yellow", "image": "images/aws.svg"},
      {"id": 7, "text": "Kafka", "color": "blue", "image": "images/kafka.svg"},
      {"id": 8, "text": "Microservices", "color": "white", "image": ""},
    ],
    "interest_bullets": [
      {"id": 1, "text": "Machine Learning", "color": "white", "image": ""},
      {"id": 2, "text": "Rust", "color": "white", "image": ""},
      {"id": 3, "text": "Music Industry", "color": "white", "image": ""}
    ]
  },
  "open_source_projects": [
    {
      "name": "chart",
      "short": "quick & smart charting for STDIN",
      "github": "https://github.com/marianogappa/chart",
      "blogpost": "https://movio.co/en/blog/improving-with-sql-and-charts/",
      "bullets": [
        "CLI tool for easy ad-hoc charting of data piped from a terminal, opening a browser tab",
        "Reached 385 Github stars in Feb 2018; featured in <a href='https://golangweekly.com/issues/167'>Golang Weekly #167</a> ",
        "Squads at Movio use it for reports & ad-hoc charting; teams around the world have reported use-cases",
      ],
      "stack": [
        {"id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg"},
        {"id": 2, "text": "Javascript", "color": "yellow", "image": "images/javascript.png"}
      ],
      "special": true
    },
    {
      "type": "open_source_project",
      "name": "sql",
      "short": "MySQL pipe",
      "github": "https://github.com/marianogappa/sql",
      "blogpost": "https://movio.co/en/blog/improving-with-sql-and-charts/",
      "bullets": [
        "CLI tool for integrating MySQL and the terminal, including concurrent querying of many databases",
        "Widely adopted within Movio for ad-hoc querying and used in combination with chart"
      ],
      "stack": [
        {"id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg"},
      ]
    },
    {
      "type": "open_source_project",
      "name": "ostinato",
      "short": "a chess library that runs on the server & the browser",
      "github": "https://github.com/marianogappa/ostinato",
      "blogpost": "https://marianogappa.github.io/software/2017/03/24/ostinato-a-chess-engine-written-in-scala-that-runs-on-the-browser-docker-and-the-repl/",
      "bullets": [
        "Feature-complete Chess library, including AI and with UI implementations",
        "Cross-compiled for both server and client; works as a server API and also standalone within the browser"
      ],
      "stack": [
        {"id": 1, "text": "Scala", "color": "red", "image": "images/scala.svg"},
        {"id": 2, "text": "Scala JS", "color": "red", "image": "images/scala.svg"},
        {"id": 3, "text": "Javascript", "color": "yellow", "image": "images/javascript.png"},
      ]
    },
    {
      "type": "open_source_project",
      "name": "flowbro",
      "short": "real-time flowchart visualisation for Kafka distributed systems",
      "github": "https://github.com/marianogappa/flowbro",
      "blogpost": "",
      "bullets": [
        "Allows devs to follow an FSM through a Kafka data pipeline based on multiple queues",
        "Requires only a JSON-based FSM configuration and broker address",
        "Used within Movio to monitor and support the company's main distributed system"
      ],
      "stack": [
        {"id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg"},
        {"id": 2, "text": "Javascript", "color": "yellow", "image": "images/javascript.png"}
      ]
    },
    {
      "type": "open_source_project",
      "name": "jira-cli",
      "short": "lightweight bash script for easily querying your company's JIRA issues",
      "github": "https://github.com/marianogappa/jira-cli",
      "blogpost": "http://marianogappa.github.io/software/2016/05/10/jira-cli/",
      "stack": [
        {"id": 1, "text": "Bash", "color": "black", "image": "images/bash.png"},
      ],
      "hidable": true
    },
    {
      "type": "open_source_project",
      "name": "sd",
      "short": "stream differ",
      "github": "https://github.com/marianogappa/sd",
      "blogpost": "http://marianogappa.github.io/software/2016/07/30/diffing-streams-on-the-terminal/",
      "stack": [
        {"id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg"},
      ],
      "hidable": true
    }
  ],
  "work_experience": [
    {
      "type": "work_experience",
      "role": "Software Engineer Squad Lead",
      "company": "Movio",
      "company_link": "https://movio.co/en/",
      "date_range": "Feb 2018 - Present",
      "started": "Feb 2018",
      "elapsed_time": "(2 months)",
      "bullets": ["Leading the team that is building Movio's Datawarehouse"],
      "stack": [
        {"id": 1, "text": "Spark", "color": "red", "image": "images/spark.png"},
        {"id": 2, "text": "Scala", "color": "red", "image": "images/scala.svg"},
        {"id": 3, "text": "AWS", "color": "yellow", "image": "images/aws.svg"},
      ]
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Movio",
      "company_link": "https://movio.co/en/",
      "date_range": "Sep 2013 - Jan 2018",
      "started": "Sep 2013",
      "elapsed_time": "(4.5 years)",
      "bullets": [
        "2017: led 3-person team that implemented service that <a href='http://marianogappa.github.io/software/2018/04/02/we-saved-50ky-with-a-tiny-go-µservice-coded-in-a-hackathon/'>saved $50k/yr in AWS cost and benchmarked 80% faster on avg</a>",
        "2016: was key advocate and enabler for <a href='https://movio.co/en/blog/migrate-Scala-to-Go/'>migration from Scala to Go</a>, and from monolith to microservices",
        "2015: formed 4-person team that implemented custom columnar database replication on top of MySQL",
        "2014: formed 3-person team that migrated large legacy product with new offering without downtime",
        "Authored open source tools currently being used by the engineers, and many teams around the world",
        "Authored a number of blogposts featured on Hacker News, <a href='http://golangweekly.com/issues/144'>Golang Weekly #144</a> & <a href='https://us2.campaign-archive.com/?u=ba834c562d82d9aba5eaf90ba&id=66b0dd9e86'>Scala Times #154</a>",
      ],
      "stack": [
        {"id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg"},
        {"id": 2, "text": "Scala", "color": "red", "image": "images/scala.svg"},
        {"id": 3, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
        {"id": 4, "text": "MariaDB", "color": "blue", "image": "images/mariadb.svg"},
        {"id": 5, "text": "AWS", "color": "yellow", "image": "images/aws.svg"},
        {"id": 6, "text": "Kubernetes", "color": "blue", "image": "images/kubernetes.svg"},
        {"id": 7, "text": "Kafka", "color": "blue", "image": "images/kafka.svg"},
        {"id": 8, "text": "Cassandra", "color": "blue", "image": "images/cassandra.svg"},
      ],
      "special": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "OLX",
      "company_link": "http://www.olx.in",
      "date_range": "Jan 2013 - Sep 2013",
      "started": "Jan 2013",
      "elapsed_time": "(9 months)",
      "bullets": [
        "Co-wrote Scala API for all mobile versions of the OLX app",
        "The API went on to power OLX India, the #2 e-commerce market in the world by population",
        "<a href='https://en.wikipedia.org/wiki/OLX#India'>\"OLX became the vernacular for 'selling' in India, in the form of [...] 'OLX it'.\"</a>"
      ],
      "stack": [
        {"id": 1, "text": "Scala", "color": "red", "image": "images/scala.svg"},
      ]
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Psicofxp S.A.",
      "date_range": "Aug 2012 - Nov 2012",
      "started": "Aug 2012",
      "elapsed_time": "(4 months)",
      "bullets": ["Co-designed a Pinterest-like project and maintained the #1 Argentinian forum (#1 by daily active users)"],
      "stack": [
        {"id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
        {"id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg"},
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Rocket Internet GmbH",
      "company_link": "http://www.rocket-internet.de/",
      "date_range": "Mar 2012 - Jun 2012",
      "started": "Mar 2012",
      "elapsed_time": "(4 months)",
      "bullets": ["Implemented Rocket Internet e-commerce ventures throughout Latin America"],
      "stack": [
        {"id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
        {"id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg"},
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer (freelance)",
      "date_range": "Sep 2011 - Mar 2012",
      "started": "Sep 2011",
      "elapsed_time": "(6 months)",
      "bullets": [
        "Various short-lived projects while focusing on engineering thesis"
      ],
      "stack": [
        {"id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
        {"id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg"},
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Metrogames",
      "company_link": "http://www.metrogames.com/",
      "date_range": "Mar 2010 - Aug 2011",
      "started": "Mar 2010",
      "elapsed_time": "(1.5 years)",
      "bullets": [
        "Backend Developer Leader of <a href='https://www.facebook.com/cocogirl'>Coco Girl</a>, the last big Metrogames' game project (60+ people involved)"
      ],
      "stack": [
        {"id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
        {"id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg"},
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Developer",
      "company": "Casablanca Hardware Store Chain",
      "date_range": "2007",
      "started": "Jan 2007",
      "elapsed_time": "(1 year)",
      "bullets": ["Designed, implemented and maintained hardware store accounting and inventory system"],
      "stack": [
        {"id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
        {"id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg"},
        {"id": 3, "text": "Javascript", "color": "yellow", "image": "images/javascript.png"},
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Developer",
      "company": "AranaParera Real Estate",
      "date_range": "2006",
      "started": "Jan 2006",
      "elapsed_time": "(6 months)",
      "bullets": ["Designed, implemented and maintained real-estate website"],
      "stack": [
        {"id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg"},
        {"id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg"},
        {"id": 3, "text": "Javascript", "color": "yellow", "image": "images/javascript.png"},
      ],
      "hidable": true
    }
  ],
  "education": [
    {
      "type": "education",
      "name": "National Technological University (UTN-FRBA)",
      "short_name": "<a href='https://www.frba.utn.edu.ar/en/home/'>UTN-FRBA</a>",
      "company_link": "https://www.frba.utn.edu.ar/en/home/",
      "title": "Information Systems Engineer - Bachelor degree (5 years)",
      "degree_type": "",
      "date_range": "2004-2011",
      "bullets": [
        "Bachelor degree (5 years)"
      ]
    }
  ]
}
