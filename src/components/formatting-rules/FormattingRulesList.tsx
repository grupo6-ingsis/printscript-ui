import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Checkbox, FormControl, InputLabel,
    List,
    ListItem,
    ListItemText, MenuItem, Select, TextField,
    Typography
} from "@mui/material";
import {useGetFormatRules, useModifyFormatRules} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";
import {Rule} from "../../types/Rule.ts";

const FormattingRulesList = () => {
  const [rules, setRules] = useState<Rule[] | undefined>([]);

  const {data, isLoading} = useGetFormatRules();
  const {mutateAsync, isLoading: isLoadingMutate} = useModifyFormatRules({
    onSuccess: () => queryClient.invalidateQueries('formatRules')
  })

  useEffect(() => {
    setRules(data)
  }, [data]);

  const handleValueChange = (rule: Rule, newValue: string | number) => {
    const newRules = rules?.map(r => {
      if (r.name === rule.name) {
        return {...r, value: String(newValue)}
      } else {
        return r;
      }
    })
    setRules(newRules)
  };


  const handleNumberChange = (rule: Rule) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    handleValueChange(rule, isNaN(value) ? 0 : value);
  };

  const toggleRule = (rule: Rule) => () => {
    const newRules = rules?.map(r => {
      if (r.name === rule.name) {
        return {...r, isActive: !r.isActive}
      } else {
        return r;
      }
    })
    setRules(newRules)
  }

  return (
    <Card style={{padding: 16, margin: 16}}>
      <Typography variant={"h6"}>Formatting rules</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
          isLoading || isLoadingMutate ?  <Typography style={{height: 80}}>Loading...</Typography> :
          rules?.map((rule) => {
          return (
            <ListItem
              key={rule.name}
              disablePadding
              style={{height: 40}}
            >
              <Checkbox
                edge="start"
                checked={rule.isActive}
                disableRipple
                onChange={toggleRule(rule)}
              />
              <ListItemText primary={rule.name} />

                // Inside your map for rules:
                {rule.valueOptions && rule.valueOptions.length > 0 ? (
                        <FormControl variant="standard" sx={{ minWidth: 150 }}>
                            <InputLabel>Format</InputLabel>
                            <Select
                                value={rule.value !== undefined && rule.value !== null ? String(rule.value) : ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (rule.valueOptions && rule.valueOptions.length > 0) {
                                        const option = rule.valueOptions.find(opt => String(opt) === val);
                                        handleValueChange(rule, typeof option === 'number' ? Number(val) : val);
                                    }
                                }}
                            >
                                {rule.valueOptions.map(option => (
                                    <MenuItem key={option} value={String(option)}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>) :
              typeof rule.value === 'number' ?
                (<TextField
                  type="number"
                  variant={"standard"}
                  value={rule.value}
                  onChange={handleNumberChange(rule)}
                />) : typeof rule.value === 'string' ?
                  (<TextField
                    variant={"standard"}
                    value={rule.value}
                    onChange={e => handleValueChange(rule, e.target.value)}
                  />) : null
              }
            </ListItem>
          )
        })}
      </List>
      <Button disabled={isLoading} variant={"contained"} onClick={() => mutateAsync(rules ?? [])}>Save</Button>
    </Card>

  );
};

export default FormattingRulesList;