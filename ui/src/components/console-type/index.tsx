import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
} from '@mui/material'
import { ConsoleType } from '../../api/generated/graphql'

const consoleTypes: { [key: string]: { label: string; value: ConsoleType }[] } =
  {
    OPENSTACK: [
      {
        label: 'NoVNC Console',
        value: ConsoleType.Novnc,
      },
      {
        label: 'Serial Console',
        value: ConsoleType.Serial,
      },
    ],
  }

export default function ConsoleTypeSelect({
  providerType,
  value,
  onChange,
  ...props
}: {
  providerType: string
  value?: ConsoleType
  onChange?: (value: ConsoleType) => void
} & SelectProps) {
  return (
    <FormControl variant="filled">
      <InputLabel id="console-type-select-label">Console Type</InputLabel>
      <Select
        {...props}
        labelId="console-type-select-label"
        id="console-type-select"
        value={value}
        label="Console Type"
        onChange={(e) => onChange && onChange(e.target.value as ConsoleType)}
      >
        {consoleTypes[providerType] === undefined ? (
          <MenuItem value="" disabled>
            Invalid Provider Type
          </MenuItem>
        ) : (
          consoleTypes[providerType].map(({ label, value }) => (
            <MenuItem key={`${providerType}-${value}`} value={value}>
              {label}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  )
}
