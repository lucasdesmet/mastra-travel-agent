import { mastra } from "./"
import { input, select } from '@inquirer/prompts'
import { humanInputStep } from './workflows'
import 'dotenv/config'
 
const workflow = mastra.vnext_getWorkflow('travelAgentWorkflow')
const run = workflow.createRun({})

const vacationDescription = await input({
  message: "describe the holiday you want",
  default: 'I want to go to the beach'
})
const result = await run.start({
  inputData: { vacationDescription },
})
 
console.log('result', result)
 
const suggStep = result?.steps?.['generate-suggestions']
 
if (suggStep.status === 'success') {
  const suggestions = suggStep.output?.suggestions as {location: string, description: string}[]
  const userInput = await select<string>({
    message: "Choose your holiday destination",
    choices: suggestions.map(({ location, description }) =>`- ${location}: ${description}`)
  })
 
  console.log('Selected:', userInput)
 
  console.log('resuming from', result, 'with', {
    inputData: {
      selection: userInput,
      vacationDescription: 'I want to go to the beach',
      suggestions: suggStep?.output?.suggestions,
    },
    step: humanInputStep,
  })
 
  const result2 = await run.resume({
    resumeData: {
      selection: userInput,
    //   vacationDescription: 'I want to go to the beach',
    //   suggestions: suggStep?.output?.suggestions,
    },
    step: humanInputStep,
  })
 
  console.dir(result2, { depth: null })
}
