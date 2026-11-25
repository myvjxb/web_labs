export class User {
  constructor(id, email, name, role = "customer") {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
  }

  isAdmin() {
    return this.role === "admin";
  }
}