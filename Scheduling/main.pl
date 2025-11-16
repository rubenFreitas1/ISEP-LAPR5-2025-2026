:- use_module(library(http/thread_httpd)).    
:- use_module(library(http/http_dispatch)).    
:- use_module(library(http/http_json)).
:- consult('http_handler.pl').

:- initialization(start).

start :-
    start_server,
    wait_forever.

start_server :-
    http_server(http_dispatch, [port(6000), reuse_addr(true)]).

wait_forever :-
    thread_get_message(_).
