import UsersDao from "../persistencia/mongoDb/users.dao.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import { CurrentUserDTO } from "../controller/DTO/user.dto.js";
import Mail from "../helpers/mail.js";
const mail = new Mail();
export default class UsersService {
  constructor() {
    this.usersDao = new UsersDao();
  }

  async updateUserPremiumService(req, userID) {
    try {
      const user = await userModel.findOne({ _id: userID });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      if (user.documents.length != 3) {
        throw new Error("Debe cargar la documentacion requerida para acceder");
      }
      if (user.role == "admin") {
        throw new Error("El admin no puede cambiar roles");
      }
      if (user.documents.length == 3) {
        if (user.premium === false) {
          user.premium = true;
          req.session.user.premium = true;
          return await this.usersDao.updateUserPremiumDao(user);
        }
      }
      if (user.premium && user.role != "admin") {
        user.premium = false;
        req.session.user.premium = false;
        return await this.usersDao.updateUserPremiumDao(user);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUsersService() {
    try {
      const users = await userModel.find();
      if (!users) {
        throw new Error("No se conecto con la base de datos de usuarios");
      }
      if (users.length > 0) {
        const usersDto = users.map((user) => new CurrentUserDTO(user));
        return usersDto;
      }
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUsersService() {
    const currentTime = new Date();
    try {
      let users = await userModel.find();
      if(!users){
        throw new Error('Error al obtener los usuarios en la base de datos')
      }
      if (users.length > 0) {
        const usersToDelete = users.filter((user) => {
          const lastConnectionTime = new Date(user.last_connection);
          const cutoffTime = new Date(currentTime);
          cutoffTime.setDate(cutoffTime.getDate() - 2);
          return lastConnectionTime < cutoffTime;
        });
        for (const user of usersToDelete) {
          mail.sendDeleteUser(
            user,
            "Se ha eliminado su cuenta",
            `https://mustafa-backend-production.up.railway.app/api/sessions/register`
          );
          await this.usersDao.deleteUsersById(user._id);
        }
        return usersToDelete;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async documentsService(req, files, user) {
    try {
      if (!files.fotoPerfil) {
        throw new Error("No se cargo la foto de perfil");
      }
      if (!files.dniFrente) {
        throw new Error("No se cargo la foto DNI Frente");
      }
      if (!files.dniDorso) {
        throw new Error("No se cargo la foto DNI Dorso");
      }
      const fotoPerfil = {
        name: files.fotoPerfil[0].filename,
        reference: files.fotoPerfil[0].path.split("public\\")[1],
      };
      const dniFrente = {
        name: files.dniFrente[0].filename,
        reference: files.dniFrente[0].path.split("public\\")[1],
      };
      const dniDorso = {
        name: files.dniDorso[0].filename,
        reference: files.dniDorso[0].path.split("public\\")[1],
      };
      if (user.documents.length < 3) {
        user.documents.push(fotoPerfil, dniFrente, dniDorso);
      } else {
        throw new Error("Ya ha cargado todos sus documentos");
      }
      return await this.usersDao.documentsDao(req, user);
    } catch (error) {
      throw error;
    }
  }
}
