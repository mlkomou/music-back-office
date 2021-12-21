import { Artisite } from "./artiste";
import { Fan } from "./fan";

export class Utilisateur {
  id?: number;
  telephone: string;
  mot_de_passe: string;
  artiste: Artisite;
  fan: Fan;
  date_creation: Date;
  date_modification: Date;
  supprime: boolean;

}
