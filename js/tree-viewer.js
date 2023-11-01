class TreeNode {
  constructor(node, property, value) {
    this.node = node
    this.property = property
    this.value = value
  }

  addStringClass = (spanNode) => {
    if (isStringNode(this.value)) {
      spanNode.classList.add("string")
    }
  }

  generateSpan = (content, className = "") => {
    const spanNode = createHtmlElement("span")
  
    if (className) {
      spanNode.classList.add(className)
    }
    
    if (isOpenCloseChar(content) || isFalsyChar(content)) {
      spanNode.textContent = String(content)
      return spanNode
    }
  
    if (isNotNumberChar(content) || content == "") {
      spanNode.textContent = `"${String(content)}"`
      return spanNode
    }
    
    spanNode.textContent = String(content)
    return spanNode
  }

  parentNodeType = () => {
    return Array.isArray(this.value) ? "array" : "object"
  }

  renderNodeProperty = () => {
    const spanNode = this.generateSpan(this.property, "object-property")
    this.node.appendChild(spanNode)
  }

  renderNodeValue = () => {
    const spanNode = this.generateSpan(this.value, "object-value")
    this.addStringClass(spanNode)
    this.node.appendChild(spanNode)
  }

  renderNode = () => {
    if (isNotNumberChar(this.property)) {
      this.renderNodeProperty()
    }
    
    this.renderNodeValue()
  }

  renderNestedNode = (spanOpenNode, spanCloseNode) => {
    this.node.appendChild(spanOpenNode)

    const tree = new Tree(this.node, this.value)
    tree.render()

    this.node.appendChild(spanCloseNode)
  }

  renderParentNodeProperty = (typeNode, spanCloseNode) => {
    const spanOpenNode = this.generateSpan(this.property, `key-${typeNode}`)
    this.renderNestedNode(spanOpenNode, spanCloseNode)
  }

  renderParentNodeChar = (spanCloseNode) => {
    const openChar = Array.isArray(this.value) ? "[" : "{"
    const spanOpenNode = this.generateSpan(openChar, 'open-property')
    this.renderNestedNode(spanOpenNode, spanCloseNode)
  }

  renderParentNode = () => {
    const typeNode = this.parentNodeType()

    const closeChar = Array.isArray(this.value) ? "]" : "}"

    const spanCloseNode = this.generateSpan(closeChar, `close-property`)
  
    this.node.classList.add(typeNode)
  
    if (isNotNumberChar(this.property)) { // "Actors"
      this.renderParentNodeProperty(typeNode, spanCloseNode)
      return
    }
  
    this.renderParentNodeChar(spanCloseNode)
  }

  render = () => {
    if (isObjectNode(this.value) && this.value !== null) {
      this.renderParentNode()
      return
    }
  
    this.renderNode()
  }
}

class Tree {
  constructor(parent, data, pagination = null) {
    this.parent = parent
    this.node = null
    this.data = data
    this.pagination = pagination
  }

  render = () => {
    if (!this.node) {
      this.node = createHtmlElement("ul")
    }

    const keys = Object.keys(this.data)
    const perPage = this.pagination?.perPage || keys.length
    const maxPerPage = Math.min(perPage, keys.length)
    const currentPage = this.pagination?.currentPage || 0
    
    const start = perPage * currentPage
    const end = start + maxPerPage

    for (let i = start; i < end; i++) {
      const property = keys[i]
      const value = this.data[property]

      const li = createHtmlElement("li")

      const treeNode = new TreeNode(li, property, value)
      treeNode.render()

      this.node.appendChild(li)      
    }

    this.parent.appendChild(this.node)
  }
}
