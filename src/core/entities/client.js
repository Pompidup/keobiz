class Client {
  id;
  firstName;
  lastName;

  static create(firstName, lastName) {
    if (!this.validate(firstName) || !this.validate(lastName)) {
      throw new Error("First and last name are required");
    }

    const client = new Client();
    client.firstName = firstName;
    client.lastName = lastName;

    return client;
  }

  static validate(value) {
    return value && value.trim() !== "";
  }

  updateFirstName(firstName) {
    if (!Client.validate(firstName)) {
      throw new Error("Invalid first name");
    }

    this.firstName = firstName;
  }

  updateLastName(lastName) {
    if (!Client.validate(lastName)) {
      throw new Error("Invalid last name");
    }

    this.lastName = lastName;
  }

  static updateDetails(firstName, lastName) {
    if (firstName) {
      this.updateFirstName(firstName);
    }

    if (lastName) {
      this.updateLastName(lastName);
    }
  }
}

export default Client;
