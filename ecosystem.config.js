module.exports = {
    apps : [{
      name   : "canxium-community-campaigns",
      script : "node src/index.js",
      env: {
      }
    }, {
      name   : "canxium-campaigns-job",
      script : "node src/job.js",
      env: {
      }
    }]
  }