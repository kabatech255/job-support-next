import React, { useState, useEffect } from 'react'
import { FormDialog } from '@/components/organisms'
import { useForm, Controller } from 'react-hook-form'
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ChatRoomInputs, MemberExtInputs } from '@/interfaces/form/inputs'
import { ChatRoomSubmit } from '@/interfaces/form/submit'
import { ChatRoom } from '@/interfaces/models'
import { FormErrorMessage } from '@/components/atoms'
import PropTypes from 'prop-types'
import { useMemberList } from '@/hooks'

export type Props = {
  defaultValues: ChatRoomInputs
  fixedMember: MemberExtInputs[]
  sharedBy: number
  open: boolean
  setOpen: (isOpen: boolean) => void
  req: (submitData: ChatRoomSubmit) => Promise<ChatRoom>
  onSuccess: (response: ChatRoom) => void
  saveAction: 'create' | 'update'
  dialogTitle: string
}

const ChatRoomForm = ({
  defaultValues,
  fixedMember,
  sharedBy,
  open,
  setOpen,
  req,
  onSuccess,
  saveAction,
  dialogTitle,
}: Props) => {
  // const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { memberList } = useMemberList({ sharedBy })

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChatRoomInputs>({
    defaultValues,
  })
  const selectedMembers = watch('members', fixedMember)

  useEffect(() => {
    setValue('name', defaultValues.name)
    setValue('created_by', defaultValues.created_by)
    setValue('members', defaultValues.members)
  }, [setValue, defaultValues])

  const handleMembers = (
    event: React.ChangeEvent<{}>,
    newValue: MemberExtInputs[]
  ) => {
    setValue('members', [
      ...fixedMember,
      ...newValue.filter(
        (option: MemberExtInputs) => fixedMember.indexOf(option) === -1
      ),
    ])
    if (newValue.length > 0) {
      clearErrors('members')
    }
  }

  const handleCheck = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(
      'members',
      selectedMembers.map((member: MemberExtInputs) => {
        if (member.id === id) {
          member.is_editable = !member.is_editable
        }
        return member
      })
    )
  }

  const handleSave = async (data: ChatRoomInputs) => {
    setLoading(true)
    const submitMember: ChatRoomSubmit['members'] = {}
    data.members.forEach((member) => {
      submitMember[member.id] = {
        is_editable: !!member.is_editable,
        shared_by: sharedBy,
      }
    })
    const submitData = {
      created_by: data.created_by,
      name: data.name,
      members: submitMember,
    }
    await req(submitData)
      .then((newChatRoom) => {
        setOpen(false)
        reset()
        onSuccess(newChatRoom)
      })
      .catch((err) => {
        if (err.status === 422) {
          const errBody: { [k: string]: string[] } = err.data.errors
          Object.keys(errBody).forEach((key) => {
            setError(key, {
              type: 'invalid',
              message: errBody[key][0],
            })
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <FormDialog
        open={open}
        setOpen={setOpen}
        dialogTitle={dialogTitle}
        onSubmit={handleSubmit(handleSave)}
        isCircular
        loading={loading}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: '???????????????????????????',
                },
                maxLength: {
                  value: 80,
                  message: '???????????????80???????????????????????????????????????',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="????????????????????????"
                  variant="outlined"
                  error={!!errors.name}
                  fullWidth
                />
              )}
            />
            <p style={{ minHeight: 20 }}>
              {!!errors.name && <FormErrorMessage msg={errors.name.message} />}
            </p>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="members"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: '?????????????????????????????????',
                },
                minLength: {
                  value: 1,
                  message: '???????????????????????????1???????????????????????????',
                },
              }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  id="chatroom_members_field"
                  options={memberList}
                  value={selectedMembers}
                  defaultValue={getValues('members')}
                  onChange={handleMembers}
                  getOptionLabel={(option) => option.full_name}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={`member_${index}`}
                        label={option.full_name}
                        {...getTagProps({ index })}
                        disabled={fixedMember.indexOf(option) !== -1}
                      />
                    ))
                  }
                  style={{
                    width: '100%',
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="??????????????????"
                      variant="outlined"
                      placeholder="???"
                      required
                      error={!!errors.members}
                    />
                  )}
                />
              )}
            />
            <p style={{ minHeight: 20 }}>
              {!!errors.members && (
                <FormErrorMessage
                  msg={
                    /* @ts-ignore */
                    errors.members.message
                  }
                />
              )}
            </p>
          </Grid>
          <Grid item xs={12}>
            {selectedMembers.length > 0 &&
              selectedMembers.map((member) => (
                <FormControlLabel
                  key={member.id}
                  control={
                    <Checkbox
                      checked={!!member.is_editable!}
                      onChange={handleCheck.bind(null, member.id)}
                      name="member"
                      color="primary"
                    />
                  }
                  label={`${member.full_name}????????????????????????????????????`}
                />
              ))}
          </Grid>
        </Grid>
      </FormDialog>
    </>
  )
}

ChatRoomForm.propTypes = {
  saveAction: PropTypes.string,
  dialogTitle: PropTypes.string,
}

ChatRoomForm.defaultProps = {
  saveAction: 'update',
  dialogTitle: '??????????????????????????????',
}

export default ChatRoomForm
