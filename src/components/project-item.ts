import { Component } from './base-component'
import { Draggable } from '../models/drag-drop'
import { Autobind } from '../decorators/autobind'
import { Project } from '../models/project'

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> 
    implements Draggable{
    
    get people(){
        if(this.projectItem.people === 1) return '1 Person'
        else return `${this.projectItem.people} People`
    }

    constructor(private projectItem: Project, hostId: string){
        super('single-project', hostId, false, projectItem.id)
        
        this.configure()
        this.renderContent()
    }   

    @Autobind
    dragStartHandler(event: DragEvent){
        event.dataTransfer!.setData('text/plain', this.projectItem.id) // copy data to dragging item
        event.dataTransfer!.effectAllowed = 'move' // we want to move data/item
    }

    dragEndHandler(_: DragEvent){}

    configure(){
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent(){
        this.element.querySelector('h2')!.textContent = this.projectItem.title
        this.element.querySelector('h3')!.textContent = this.people + ' assigned'
        this.element.querySelector('p')!.textContent = this.projectItem.description
    }
}