module.exports = {
  apps : [{
    name   : "api.farene.be",
    script : "npm run start",
    instance_var: 'INSTANCE_ID',
    env: {
      NODE_ENV: "development"
    },
  }]
}
