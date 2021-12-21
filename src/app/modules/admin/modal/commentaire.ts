import { Song } from "./song";

export class Commentaire {
  id?: number;
  message: string;
  utilisateur: any;
  song: Song;
}
