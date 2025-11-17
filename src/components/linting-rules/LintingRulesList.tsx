import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import {useGetLintingRules, useModifyLintingRules} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";
import {Rule} from "../../types/Rule.ts";

const LintingRulesList = () => {
  const [rules, setRules] = useState<Rule[] | undefined>([]);

  const {data, isLoading} = useGetLintingRules();
  const {mutateAsync, isLoading: isLoadingMutate} = useModifyLintingRules({
    onSuccess: () => queryClient.invalidateQueries('lintingRules')
  })

  useEffect(() => {
    // Initialize rules with default values for hasValue rules
    const initializedRules = data?.map(rule => {
      if (rule.hasValue && (rule.value === null || rule.value === undefined)) {
        // If rule has options, use the first one as default
        if (rule.valueOptions && rule.valueOptions.length > 0) {
          return { ...rule, value: rule.valueOptions[0] };
        }
        return { ...rule, value: '' };
      }
      return rule;
    });
    setRules(initializedRules);
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
        let newValue: string | null | undefined = r.value;
        if (!r.isActive && r.hasValue && (r.value === null || r.value === undefined || r.value === '')) {
          if (r.valueOptions && r.valueOptions.length > 0) {
            newValue = r.valueOptions[0];
          } else {
            newValue = '';
          }
        }

        return {...r, isActive: !r.isActive, value: newValue}
      } else {
        return r;
      }
    })
    setRules(newRules)
  }


  const handleSave = () => {
    // Validate rules with hasValue before saving
    const invalidRules = rules?.filter(r => 
      r.isActive && r.hasValue && (r.value === null || r.value === undefined || r.value === '')
    );
    
    if (invalidRules && invalidRules.length > 0) {
      alert(`Please provide values for: ${invalidRules.map(r => r.name).join(', ')}`);
      return;
    }
    
    mutateAsync(rules ?? []);
  };

  return (
    <Card style={{padding: 16, margin: 16}}>
      <Typography variant={"h6"}>Linting rules</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
          isLoading || isLoadingMutate ?  <Typography style={{height: 80}}>Loading...</Typography> :
          rules?.map((rule) => {
          return (
            <ListItem
              key={rule.name}
              disablePadding
              style={{minHeight: 40, marginBottom: 8}}
            >
              <Checkbox
                edge="start"
                checked={rule.isActive}
                disableRipple
                onChange={toggleRule(rule)}
              />
              <ListItemText primary={rule.name} />
                {rule.hasValue && (
                    rule.valueOptions && rule.valueOptions.length > 0 ? (
                        <FormControl variant="standard" sx={{ minWidth: 150 }}>
                          <InputLabel>Format</InputLabel>
                          <Select
                            value={rule.value ?? ''}
                            onChange={(e) => handleValueChange(rule, e.target.value)}
                            required={rule.isActive}
                            error={rule.isActive && (rule.value === null || rule.value === undefined || rule.value === '')}
                          >
                            {rule.valueOptions.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                    ) : typeof rule.value === 'number' || !isNaN(Number(rule.value)) ? (
                        <TextField
                            type="number"
                            variant="standard"
                            value={rule.value ?? ''}
                            onChange={handleNumberChange(rule)}
                            required={rule.isActive}
                            error={rule.isActive && (rule.value === null || rule.value === undefined || rule.value === '')}
                        />
                    ) : (
                        <TextField
                            variant="standard"
                            value={rule.value ?? ''}
                            onChange={e => handleValueChange(rule, e.target.value)}
                            required={rule.isActive}
                            error={rule.isActive && (rule.value === null || rule.value === undefined || rule.value === '')}
                        />
                    )
                )}

            </ListItem>
          )
        })}
      </List>
      <Button disabled={isLoading} variant={"contained"} onClick={handleSave}>Save</Button>
    </Card>

  );
};

export default LintingRulesList;