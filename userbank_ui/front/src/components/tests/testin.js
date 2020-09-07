console.clear();
const { PureComponent } = React;

class App extends PureComponent {
   state = {
      formState: {
         id: '',
         firstName: "",
         lastName: "",
         email: "",
         mode: "submit"
      },
      users: []
   };

   resetFormState = () => {
      this.setState({
         formState: {
            firstName: "",
            lastName: "",
            email: "",
            mode: "submit",
            id: ""
         }
      });
   };

   onChange = event => {
      this.setState({
         formState: {
            ...this.state.formState,
            [event.target.name]: event.target.value
         }
      });
   };

   onSubmit = event => {
      const { users, formState } = this.state;
      event.preventDefault();
      const firstName = event.target.querySelector("input[name='firstName']")
         .value;
      const lastName = event.target.querySelector("input[name='lastName']")
         .value;
      const email = event.target.querySelector("input[name='email']").value;
      if (formState.mode === "submit") {
         this.setState({
            users: [
               ...this.state.users,
               {
                  firstName,
                  lastName,
                  email,
                  updating: false,
                  id: this.state.users[this.state.users.length - 1].id + 1
               }
            ]
         });
      } else if (formState.mode === "edit") {
         const index = users.find((user)=> user.id === formState.id).id;
         users[index] = {
                  firstName,
                  lastName,
                  email,
                  updating: false,
                  id: users[index].id
               }
         this.setState({
            users: [...users]
         });
      }

      this.resetFormState();
   };

   updateUser = key => {
      let { users } = this.state;
      users[key].updating = true;

      this.setState({
         formState: { ...this.state.users[key], mode: "edit" },
         users
      });
   };

   deleteUser = key => {
      let { users } = this.state;
      users.splice(key, 1);
      this.setState({
         users: [...users]
      });
   };

   render() {
      const { users, formState } = this.state;
      return (
         <div>
            <Form
               formState={formState}
               onChange={this.onChange}
               onSubmit={this.onSubmit}
            />
            <Table
               users={users}
               updateUser={this.updateUser}
               deleteUser={this.deleteUser}
            />
         </div>
      );
   }
}

const Table = ({ users = [], updateUser, deleteUser }) => {
   return (
      <div className="table">
         <div className="table-header">
            <div className="row">
               <div className="column">First Name</div>
               <div className="column">Last Name</div>
               <div className="column">Email</div>
               <div className="column">Options</div>
            </div>
         </div>
         <div className="table-body">
            {users.map((user, key) => {
               return (
                  <div className={`row ${user.updating ? "updating" : ""}`}>
                     <div className="column">{user.firstName}</div>
                     <div className="column">{user.lastName}</div>
                     <div className="column">{user.email}</div>
                     <div className="column">
                        <button
                           className="icon"
                           onClick={() => updateUser(key)}
                        >
                           <i class="far fa-edit" />
                        </button>
                        <button className="icon">
                           <i
                              class="fas fa-user-minus"
                              onClick={() => deleteUser(key)}
                           />
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
};

const Field = ({ label = "", name = "", value = "", onChange }) => {
   return (
      <div className="field">
         <label htmlFOR={name}>{label}</label>
         <input type="text" name={name} value={value} onChange={onChange} />
      </div>
   );
};

const Form = ({ formState, onChange, onSubmit }) => {
   return (
      <form className="form" onSubmit={onSubmit}>
         <fieldset>
            <Field
               name="firstName"
               label="user name"
               value={formState.firstName}
               onChange={onChange}
            />
            <Field
               name="lastName"
               label="last name"
               value={formState.lastName}
               onChange={onChange}
            />
            <Field
               name="email"
               label="email"
               value={formState.email}
               onChange={onChange}
            />
         </fieldset>
         <button>{formState.mode}</button>
      </form>
   );
};

ReactDOM.render(<App />, document.getElementById("container"));
