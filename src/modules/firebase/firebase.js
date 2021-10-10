import * as firebaseSource from "firebase";
import store from "../../utils/store";
import utils from "../../utils/utils";
import { v4 as uuidv4 } from "uuid";

class Firebase {
  //Horno de Juan
  async login(email, password) {
    let status = null;
    const login = await firebaseSource
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        if (error != null && error.code != null) {
          status = {
            login: false,
            error: error.code,
          };
        }
      });
    if (status != null) {
      return status;
    }
    const info = await this.findUserInfo(email);
    return true;
  }

  async findUserInfo(email) {
    console.log("ahhh");
    const db = firebaseSource.firestore();
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log("ahhhh2");
          store.dispatch({
            type: "LOGIN",
            data: doc.data(),
          });
        });
      })
      .catch(function (error) {});
  }

  async logout() {
    let status = null;
    const login = await firebaseSource
      .auth()
      .signOut()
      .catch((error) => {
        if (error != null && error.code != null) {
          status = {
            login: false,
            error: error.code,
          };
        }
      });
    store.dispatch({
      type: "LOGOUT",
    });
    return true;
  }

  async getUserStore() {
    const userStorageInfo = store.getState();
    return userStorageInfo;
  }

  async getBranchesFinances() {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("finances")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            finances: doc.data(),
          });
        });
      })
      .catch(function (error) {});
      console.log(data)
    return data;
  }

  async getBranchesInfo() {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("branches")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            branches: doc.data(),
          });
        });
      })
      .catch(function (error) {});
    return data;
  }

  async getBranchesList() {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("branches")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          data.push(doc.id);
        });
      })
      .catch(function (error) {});
    return data;
  }

  async getBranchFinances(id) {
    console.log("ahhh")
    console.log(id)
    let data = {};
    const db = firebaseSource.firestore();
    await db
      .collection("finances")
      .doc(id)
      .get()
      .then((querySnapshot) => {
        data = querySnapshot.data();
      })
      .catch(function (error) {});
    return data;
  }

  async getCvs(filter) {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("cv")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (filter == "favorite") {
            if (doc.data().favorite == true) {
              data.push({
                id: doc.id,
                info: doc.data(),
              });
            }
          } else if (filter == "seen") {
            if (doc.data().seen == true) {
              data.push({
                id: doc.id,
                info: doc.data(),
              });
            }
          } else {
            data.push({
              id: doc.id,
              info: doc.data(),
            });
          }
        });
      })
      .catch(function (error) {});
    return data;
  }

  async getSubscribers(filter) {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("subscribers")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (filter == "favorite") {
            if (doc.data().favorite == true) {
              data.push({
                id: doc.id,
                info: doc.data(),
              });
            }
          } else if (filter == "seen") {
            if (doc.data().seen == true) {
              data.push({
                id: doc.id,
                info: doc.data(),
              });
            }
          } else {
            data.push({
              id: doc.id,
              info: doc.data(),
            });
          }
        });
      })
      .catch(function (error) {});
    return data;
  }

  async deleteSubscriber(id) {
    let data = [];
    const db = firebaseSource.firestore();
    await db.collection("subscribers").doc(id).delete();
  }

  async updateSubscriber(id, field, value) {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("subscribers")
      .doc(id)
      .set(
        {
          [field]: value,
        },
        { merge: true }
      );
  }

   async getContact(filter) {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("messages")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (filter == "favorite") {
            if (doc.data().favorite == true) {
              data.push({
                id: doc.id,
                info: doc.data(),
              });
            }
          } else if (filter == "answer") {
            if (doc.data().answer == true) {
              data.push({
                id: doc.id,
                info: doc.data(),
              });
            }
          } else {
            data.push({
              id: doc.id,
              info: doc.data(),
            });
          }
        });
      })
      .catch(function (error) {});
    return data;
  }


  async deleteContact(id) {
    let data = [];
    const db = firebaseSource.firestore();
    await db.collection("subscribers").doc(id).delete();
  }

  async updateContact(id, field, value) {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("messages")
      .doc(id)
      .set(
        {
          [field]: value,
        },
        { merge: true }
      );
  }

  async getTeam(filter) {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("employee")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (filter != null && filter != "" && filter != "all") {
            if (filter == doc.id) {
              data.push({
                id: doc.id,
                info: doc.data(),
              });
            }
          } else {
            data.push({
              id: doc.id,
              info: doc.data(),
            });
          }
        });
      })
      .catch(function (error) {});
    return data;
  }

  async getUrl(id) {
    console.log(id);
    let imgUrl = "";
    await firebaseSource
      .storage()
      .ref("cvs")
      .child(id)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        imgUrl = url;
      });
    return imgUrl;
  }

  async deleteCv(id) {
    let data = [];
    const db = firebaseSource.firestore();
    await db.collection("cv").doc(id).delete();
  }

  async updateCv(id, field, value) {
    let data = [];
    const db = firebaseSource.firestore();
    await db
      .collection("cv")
      .doc(id)
      .set(
        {
          [field]: value,
        },
        { merge: true }
      );
  }

  //Horno de Juan
}

const firebase = new Firebase();

export default firebase;
