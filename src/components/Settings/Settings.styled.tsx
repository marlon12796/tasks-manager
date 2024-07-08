import { FormControlLabel, MenuItem, Select, Stack } from '@mui/material'
import styled from '@emotion/styled'
export const ContainerSettings = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  flex-direction: column;
  user-select: none;
  margin: 0 18px;
  gap: 6px;
`

export const SettingsStyledSelect = styled(Select)`
  width: 360px;
  margin: 8px 0;
`

export const SettingsStyledMenuItem = styled(MenuItem)`
  padding: 12px 20px;
  border-radius: 12px;
  margin: 0 8px;
  display: flex;
  gap: 6px;
`

export const SettingsStyledFormLabel = styled(FormControlLabel)`
  max-width: 350px;
`

export const SettingsNoVoiceStyles = styled.p`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
  font-weight: 500;
  max-width: 330px;
`

export const SettingsVolumeSlider = styled(Stack)`
  margin: 8px 0;
  background: #afafaf39;
  padding: 12px 24px 12px 18px;
  border-radius: 18px;
  transition: 0.3s all;
  width: 100%;
`
