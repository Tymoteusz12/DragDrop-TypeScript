import { Component } from './base-component'
import { DragTarget } from '../models/drag-drop'
import { Project, ProjectStatus } from '../models/project'
import { projectState } from '../state/project'
import { Autobind } from '../decorators/autobind'
import { ProjectItem } from './project-item'

export class ProjectList extends Component<HTMLDivElement, HTMLElement>
implements DragTarget{
    assignedProjects: Project[] = []

    constructor(private type: 'active' | 'finished'){
    super('project-list', 'app', false, `${type}-projects`)
    this.configure()
    this.renderContent()
    }

    configure(){
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(proj => {
                {
                    if(this.type === 'active')
                        return proj.status === ProjectStatus.Active 
                    return proj.status === ProjectStatus.Finished
                }
            })
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
    }

    @Autobind
    dragOverHandler(event: DragEvent){
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){// if we have data attached (plain text)
            event.preventDefault()
            const ListEl = this.element.querySelector('ul')! // if we drag over element
            ListEl.classList.add('droppable') // attach droppable
        }
    }

    @Autobind
    dropHandler(event: DragEvent){
        const projId = event.dataTransfer!.getData('text/plain') // extract data
        projectState.moveProject(projId, 
            this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @Autobind
    dragLeaveHandler(_: DragEvent){
        const ListEl = this.element.querySelector('ul')! // if we leave element
        ListEl.classList.remove('droppable') // remove class droppable
    }

    renderContent(){
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS'
    }

    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for(const projItem of this.assignedProjects){
            new ProjectItem(projItem, this.element.querySelector('ul')!.id)
        }
    }
}