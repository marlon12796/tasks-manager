import styled from '@emotion/styled'
export const ContainerTaksDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 32px;
  margin: 0 auto;
  margin-top: 100px;
  box-shadow: 0 0px 24px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    padding: 24px;
    width: 70%;
  }
`

export const TaskName = styled.h2`
  margin: 8px;
  text-align: center;
  font-size: 1.5em;

  @media (min-width: 768px) {
    font-size: 1.8em;
  }
`

export const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`

export const TableRow = styled.tr`
  border-bottom: 2px solid ${({ theme }) => theme.primary}41;

  &:last-child {
    border-bottom: none;
  }
`

export const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  font-size: 1em;

  @media (min-width: 768px) {
    font-size: 1.2em;
  }
`

export const TableData = styled.td`
  text-align: left;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1em;
  word-break: break-all;
  @media (min-width: 768px) {
    font-size: 1.1em;
  }
`

export const ColorSquare = styled.div<{ clr: string }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background-color: ${({ clr }) => clr};
`

export const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`
