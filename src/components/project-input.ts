import {Component} from './base-component'
import { Validatable, validate } from '../util/validate'
import { Autobind } from '../decorators/autobind'
import { projectState } from '../state/project'

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInput: HTMLInputElement
    descriptionInput: HTMLInputElement
    peopleInput: HTMLInputElement

    constructor(){
        super('project-input', 'app', true, 'user-input')
        this.titleInput = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionInput = this.element.querySelector('#description')! as HTMLInputElement
        this.peopleInput = this.element.querySelector('#people')! as HTMLInputElement
        this.configure()
    }

    configure(){
        this.element.addEventListener('submit', this.buttonSubmitHandler)
    }

    private gatherUserInput(): [string, string, number] | void{
        const enteredTitle = this.titleInput.value
        const enteredDescription = this.descriptionInput.value
        const enteredPeople = this.peopleInput.value

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if(!validate(titleValidatable) 
            || !validate(descriptionValidatable)
            || !validate(peopleValidatable)){
            alert('Invalid input, please try again!')
            return
        } else{
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    private clearInputs(){
        this.titleInput.value = ''
        this.descriptionInput.value = ''
        this.peopleInput.value = ''
    }

    @Autobind
    private buttonSubmitHandler(event: Event){
        event.preventDefault()
        const userInput = this.gatherUserInput()

        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput
            projectState.addProject(title, desc, people)
            this.clearInputs()
        }   
    }
    renderContent(){};
}
