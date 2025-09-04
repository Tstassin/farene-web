import { Heading, Text, Link, Box, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { FormType } from "../../backend/src/services/delivery-options/delivery-options.schema";
import { NotAuthenticated } from "./components/auth/authenticated";
import { DeliveryOptions } from "./components/delivery-options/delivery-options";
// @ts-expect-error
import * as image from './images/IMG_6124.jpg'

export const Home: React.FC = () => {

  return (
    <>
    <p>
            Après plusieurs années d’activité en tant que boulangère indépendante, dont les deux dernières à la Ferme du Champ des Noces, j’ai pris la décision de mettre un terme à la production hebdomadaire de pain.
            <br />
            <br />
            Ce choix, mûrement réfléchi, correspond à une évolution de mon parcours ainsi qu’à mes priorités personnelles et professionnelles.
            <br />
<br />
            Je tiens à remercier profondément toutes celles et ceux, client·e·s fidèles, partenaires, ami·e·s, collègues, qui m’ont accompagnée tout au long de cette aventure.
            Avoir façonné à la main ce pain vivant, nourri au levain naturel, à partir de farines bio, locales, parfois issues de céréales anciennes cultivées avec soin, a été une immense joie.
            <br />
<br />

            Un pain réalisé avec le cœur qui portait un engagement : celui de produire autrement, à taille humaine, en lien avec le vivant.
            <br />
<br />

            Pour continuer à faire vivre la filière boulangère artisanale, je vous invite à découvrir et à soutenir mes collègues qui partagent ces valeurs : travail au levain naturel, farines bio (souvent locales et paysannes), et une approche profondément artisanale du pain.
            <br />
<br />

            Voici une liste – non exhaustive, bien sûr – de boulanger·e·s locaux·ales qui perpétuent ce savoir-faire engagé :
            <br />
<br />
<ul>
<li>

            La Ferme du Champ des Noces
</li>
<li>
            Le Pain qui chante
</li>
<li>

            Les Miches de Lola
</li>
<li>

            Mich’Papot
</li>
<li>

            Le Clan Pains
</li>
<li>

            Greg le Boulanger
</li>
</ul>
<br />
<br />
<br />
            Longue vie au bon pain au levain !

            Laurence
          </p>
          <br />
          <br />
          <br />
          <br />
          <br />
      
    </>
  )
}