import styled from '@emotion/styled'
import { type CSSProperties } from 'react'

import { fadeIn } from '../../styles'
export const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px;
`

export const EmojiPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
  animation: ${fadeIn} 0.4s ease-in;
`

export const PickerLoader = styled.div<{
  pickerTheme: 'light' | 'dark' | undefined
  width: CSSProperties['width'] | undefined
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width || '350px'};
  height: 500px;
  padding: 8px;
  border-radius: 20px;
  background: ${({ pickerTheme }) => (pickerTheme === 'dark' ? '#222222' : '#ffffff')};
  border: ${({ pickerTheme }) => `1px solid ${pickerTheme === 'dark' ? '#151617' : '#e7e7e7'}`};
`

export const EmojiElement = styled.div`
  animation: ${fadeIn} 0.4s ease-in;
`
