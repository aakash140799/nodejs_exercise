
module.exports = function(app) {
    Customers = app.models.Customer;
    Role = app.models.Role;
    RoleMapping = app.models.RoleMapping;
    
    Customers.findOne({username:'Admin'})
    .then((user) => {
        if(!user){
            var admin;
            Customers.create({
                username:'Admin', password:'password',email:'admin@conFusion.net'})
            .then((user) => {
                admin = user;
                RoleMapping.destroyAll();
                return Role.findOne({name:'admin'});
            })
            .then((role) => {
                if(!role){return Role.create({name:'admin'});}
                else{return Role.findOne({name:'admin'});}
            })
            .then((role) => {
                return role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: admin.id
                });
            })
            .catch((err) => {
                console.log(err);
                throw(err);
            });
        }
    });
}