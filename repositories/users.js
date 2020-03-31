const fs = require('fs');
const crypto = require('crypto');

class UserRepository {
  constructor(filename) {
    if(!filename){
      throw new Error('Creating a new repository requires a filename');
    }
    this.filename = filename;
    //check if file exists
    try {
      fs.accessSync(this.filename);
    } catch(err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }
  async getAll() {
    return JSON.parse(await fs.promises.readFile(this.filename, {encoding: 'utf8'}));
  }

  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);
    //write the updated 'records' array back to this.filename
    await this.writeAll(records);

  }

  async writeAll(records){
    await fs.promises.writeFile(this.filename,JSON.stringify(records, null, 2));

  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    Object.assign(record, attrs);
    await this.writeAll(records);

  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for(let record of records) {
      let found = true;
      for (let key in filters) {
        if(record[key] !== filters[key]){
          found = false;
        }
      }
      if (found === true) {
        return record; 
      }

    }
  }


}

// const test = async () => {

//   const repo = new UserRepository('users.json');
//   // const user = await repo.getOne('42833b003')
//   // await repo.create({email: 'test@test.com', password: 'password'});
//   // const users = await repo.getAll();
//   // console.log(user);
//   // await repo.create({email: 'test@test.com' });
//   const user = await repo.getOneBy({email: 'test@test.com'});
//   console.log(user)
// }

// test(); 

module.exports = new UserRepository('users.json');