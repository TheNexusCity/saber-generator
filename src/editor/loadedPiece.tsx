
import React from "react";
import { SaberPiece } from "../staging/saber-registry";
import "./style.scss"
import { Quality } from "../staging/loadedPiece";

export interface LoadedPieceProps
{
    piece:SaberPiece
}

export class LoadedPiece extends React.Component<LoadedPieceProps>
{
    render(): React.ReactNode {
        const props = this.props

        return (
            <div className={`LoadedPiece ${Quality.ToString(props.piece.attributes.quality)}`} >
                {props.piece.name}
            </div>
            )
    }

    
}
