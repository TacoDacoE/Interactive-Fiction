import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { ReactNode } from "react"
import { PageData } from "../../dialogueTriggers"

interface PageProps {
  page: PageData
  renderActions?: () => ReactNode
}

const Page = ({ page, renderActions }: PageProps) => {
  return (
    <Stack direction="row" height="calc(100% - 80px)">
      <Stack width={240} display="flex" alignItems="center" spacing={1} mt={4}>
        <img width="200px" height="200px" src={page.imageSrc} />
        <Typography variant='h3' fontWeight={600}>{page.name}</Typography>
      </Stack>

      <Stack width='calc(100% - 240px)' height='100%' overflow='hidden' spacing={2} pt={4}>
        <Box flex={1} overflow='auto' minHeight={0}>
          <Typography>{page.content}</Typography>
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