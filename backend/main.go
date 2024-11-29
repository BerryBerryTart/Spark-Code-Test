package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// TODOs type
type Todo struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// global todos array
var todoArray = make([]Todo, 0)

func main() {
	// Your code here
	//Sample todo on first load
	todoArray = append(todoArray, Todo{
		Title:       "Go for a jog",
		Description: "run 4km around the river",
	})

	fmt.Println("Starting server on port 8080")
	http.HandleFunc("/", ToDoListHandler)
	log.Fatal(http.ListenAndServe("127.0.0.1:8080", nil))
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Your code here
	// Create todo via POST
	if r.Method == http.MethodPost {
		fmt.Println("POST Data")
		decoder := json.NewDecoder(r.Body)
		var tempTodo Todo
		err := decoder.Decode(&tempTodo)

		//handle errors
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if tempTodo.Title == "" {
			http.Error(w, "Input Error: Title Is Required", http.StatusBadRequest)
			return
		}
		if tempTodo.Description == "" {
			http.Error(w, "Input Error: Description Is Required", http.StatusBadRequest)
			return
		}

		//Append to global array and return current state
		todoArray = append(todoArray, tempTodo)
		res, _ := json.Marshal(todoArray)
		w.Write(res)
	}

	// fetch todos via GET
	if r.Method == http.MethodGet {
		fmt.Println("GET Data")
		w.Header().Set("Content-Type", "application/json")
		res, _ := json.Marshal(todoArray)
		w.Write(res)
	}
}
