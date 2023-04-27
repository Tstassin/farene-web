import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import { useOrderDates } from "../../queries/orders"

export const OrderInstructions = () => {
  const orderDatesQuery = useOrderDates()
  const { deliveryPlaces } = orderDatesQuery.data ?? {}
  return (
    <Box>
      <Heading size={'sm'} mb={3}>Commandes et enlèvement chaque semaine</Heading>
      <Text mb={6}>
        Les commandes sont ouvertes chaque semaine pour la semaine suivante.<br />
        Les commandes se clôturent tous les dimanches à minuit.<br />
        Les commandes peuvent être retirées en points dépôts :
      </Text>
      {/* <Heading size={'sm'} mb={3}>Enlèvement le MARDI</Heading> */}
      <Text mb={6}>
        <b>{deliveryPlaces?.['farene']}</b><br />
        Le Mardi et le Jeudi
        <UnorderedList mb={5}>
          <ListItem>
            de <b>12h à 13h30</b> chez Farène : <br />
            <Text>
              Gare de Chastre, quai n°2<br />
              Rue Gaston Delvaux, 1A<br />
              1450 Chastre
            </Text>
          </ListItem>
          <ListItem mb={3}>
            de <b>14h à 20h</b> en point dépot libre accès :<br />
            <Text>
              Rue des Trois Ruisseaux, 9<br />
              1450 Chastre
            </Text>
          </ListItem>
        </UnorderedList>
        <b>{deliveryPlaces?.['offbar']}</b><br />
        Le Mardi
        <UnorderedList mb={5}>
          <ListItem mb={3}>
            de <b>11h à 19h00</b><br />
            <Text>
              Au "OFFBar"<br />
              Bâtiment du Creative Spark<br />
              Rue Emile Franqui 6<br />
              1435 Mont-Saint-Guibert
            </Text>
          </ListItem>
        </UnorderedList>
        <b>{deliveryPlaces?.['terredumilieu']}</b><br />
        Le Jeudi
        <UnorderedList mb={5}>
          <ListItem mb={3}>
            de <b>15h à 20h00</b><br />
            <Text>
              Point dépot "Paniers de légumes"<br />
              À la Terre du Milieu<br />
              Ruelle Fanfan 1<br />
              1450 Chastre
            </Text>
          </ListItem>
        </UnorderedList>
      </Text>

    </Box>
  )
}