import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { ReactNode } from "react"
import { PageData, SceneCharacter } from "../../dialogueTriggers"

interface PageProps {
  page: PageData
  sceneCharacters: SceneCharacter[]
  renderActions?: () => ReactNode
}

const Page = ({ page, sceneCharacters, renderActions }: PageProps) => {
  const speaker = sceneCharacters.find(
    (c) => c.id === page.name.toLowerCase().charAt(0) as SceneCharacter['id']
  ) ?? null

  const hasPortrait = !!speaker && !!page.name

  return (
    <Stack direction="row" height="calc(100% - 80px)">
      {hasPortrait && (
        <Stack width={240} display="flex" alignItems="center" spacing={1} mt={4}>
          <img width="200px" height="200px" src={speaker.imageSrc} />
          <Typography variant='h3' fontWeight={600} color="#212121">{page.name}</Typography>
        </Stack>
      )}

      <Stack width={hasPortrait ? 'calc(100% - 240px)' : '100%'} height='100%' overflow='hidden' spacing={2} pt={4}>
        <Box flex={1} overflow='auto' minHeight={0}>
          <Typography color="#212121">{page.content}</Typography>
        </Box>

        {renderActions && (
          <Box width='100%' display='flex' justifyContent='flex-end'>
            {renderActions()}
          </Box>
        )}
      </Stack>
    </Stack>
  )
}

export default Page