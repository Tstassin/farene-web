import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react"

export const OrderInstructions = () => {
  return (
    <Box>
      <Heading size={'sm'} mb={3}>Commandes chaque semaine</Heading>
      <Text mb={6}>
        Les commandes sont ouvertes chaque semaine pour la semaine suivante.
        Les commandes se clôturent tous les dimanches à minuit.
      </Text>
      <Heading size={'sm'} mb={3}>Enlèvement le Mardi ou Jeudi</Heading>
      <Text mb={6}>
        <UnorderedList>
          <ListItem mb={3}>
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
      </Text>

    </Box>
  )
}