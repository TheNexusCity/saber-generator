
import React from "react";
import SaberPiece from "../core/saber-piece";
import "./style.scss"
import { Quality } from "../core/saber-attributes";

export interface LoadedPieceProps
{
    piece:SaberPiece
}

export default class LoadedPiece extends React.Component<LoadedPieceProps>
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
