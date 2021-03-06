const layout = require('../layout');

const getError = (errors, prop) => {
  //prop = 'email \\ 'password || 'passwordConfirmation'
  try {
    return errors.mapped()[prop].msg;
  } catch(err) {
    return '';
  }
};

module.exports = ({req, errors}) => {
  return layout({
    content: `
    Your id is: ${req.session.userId}
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        ${getError(errors, 'email')}
        <input name="password" placeholder="password" />
        ${getError(errors, 'password')}
        <input name="passwordConfirmation" placeholder="password confirmation" />
        ${getError(errors, 'passwordConfirmation')}
        <button>Sign Up</button>
      </form>
    </div>
  `});
} 