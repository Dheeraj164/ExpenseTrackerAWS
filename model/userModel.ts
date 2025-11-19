export class UserModal {
  email?: string;
  phone_number?: string;
  name?: string;
  username?: string;

  constructor({
    email,
    phone_number,
    name,
    username,
  }: {
    email?: string;
    phone_number?: string;
    name?: string;
    username?: string;
  }) {
    this.email = email;
    this.name = name;
    this.phone_number = phone_number;
    this.username = username;
  }
}
