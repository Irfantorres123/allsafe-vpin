var db = connect("mongodb://root:root@localhost:27017/admin");

db = db.getSiblingDB("auth");

db.createUser({
  user: "irfan",
  pwd: "irfan",
  roles: [{ role: "readWrite", db: "auth" }],
  passwordDigestor: "server",
});
