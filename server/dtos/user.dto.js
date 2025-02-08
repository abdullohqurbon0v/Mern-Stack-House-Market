class UserDTO {
  constructor(payload) {
    this.fullName = payload.fullName;
    this.email = payload.email;
    this.id = payload._id;
  }
}

module.exports = UserDTO;
