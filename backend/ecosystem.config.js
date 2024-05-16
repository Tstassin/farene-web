module.exports = {
  apps : [{
    name   : "api.250degres.be",
    script : "npm run start",
    instance_var: 'INSTANCE_ID',
    env: {
      NODE_ENV: "development"
    },
  }]
}
