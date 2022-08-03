import { dateSelectionJoinTransformer } from "@fullcalendar/core";

export class Usuario {

    idUsuario: number;
    nombre: string;
    activo: boolean;
    fechaCreacion?: Date;
    autor: string;
    modificadoPor: string;
    fechaModificacion?: Date;
    usuario?: string;
    rol?: number;

}
